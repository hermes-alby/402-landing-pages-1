# StableTravel: Activities Discovery API Uses

## What This Endpoint Group Does

Search tours and activities by point or bounding square and retrieve detailed activity records for trip planning. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream activity discovery and detail data comes from Amadeus-backed activity surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/activities/search` | Search tours and activities near a location | latitude, longitude, radius, max | data, meta |
| GET | `/api/activities/by-square` | Search tours and activities within a geographic square | north, west, south, east, max | data, meta |
| GET | `/api/activities/details` | Get details of a specific tour or activity | activityId | data, meta |

## Field Notes

### Inputs

- latitude (required)
- longitude (required)
- radius
- max
- north (required)
- west (required)
- south (required)
- east (required)
- activityId (required)

### Outputs

- data
- meta

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Trip Itinerary Enrichment

Activity search by latitude/longitude or bounding square returns tours and experiences near a destination, while details by activity ID can provide richer descriptions and booking-relevant context. A personal agent can fill free hours around hotel and flight times; a travel business can upsell location-specific experiences after the core itinerary is built.

### Destination Content And Concierge Recommendations

Activity fields such as location, IDs, descriptions, ratings, categories, and detail URLs can power personalized recommendation emails, concierge chat, or city guides. The strongest workflow is not a generic dashboard but a decision list: which experiences fit the traveler's geography, interests, time window, and price tolerance.

### Group Trip Planning Around A Map Area

The by-square endpoint is useful when the destination is a neighborhood, resort zone, or event venue rather than a single point. It lets a planner compare options within explicit north/south/east/west boundaries and avoid suggestions that look nearby in city terms but are impractical in transit time.
