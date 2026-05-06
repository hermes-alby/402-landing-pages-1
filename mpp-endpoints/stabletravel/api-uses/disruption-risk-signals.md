# StableTravel: Disruption Risk Signals API Uses

## What This Endpoint Group Does

Retrieve current disruption counts by airline, origin, or destination and by time window for route or carrier risk screening. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream disruption aggregate data comes from FlightAware AeroAPI surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/flightaware/disruption-counts/:entity_type` | Get disruption counts by entity type (airline, origin, destination) | time_period, entity_id_filter, max_pages, cursor | entities, links, num_pages |
| GET | `/api/flightaware/disruption-counts/:entity_type/:id` | Get disruption counts for a specific entity | time_period | entity_type, entity_id, name, delays, cancellations, total, score |

## Field Notes

### Inputs

- time_period
- entity_id_filter
- max_pages
- cursor

### Outputs

- entities
- links
- num_pages
- entity_type
- entity_id
- name
- delays
- cancellations
- total
- score

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Carrier Or Airport Risk Screening

Disruption counts by airline, origin, or destination and time period give a compact signal before booking. A traveler can avoid a carrier or airport with elevated recent disruption counts; a business travel team can flag itineraries for approval or suggest alternatives.

### Operational Alert Prioritization

A support desk can use disruption-count endpoints to decide which travelers need proactive monitoring. The aggregate count is cheaper and faster than pulling every flight, but it is not a substitute for live flight status when an individual itinerary is already known.

### Travel Insurance And Customer-Service Triage

Insurers, OTAs, and concierge teams can use disruption counts as an early triage feature for claims risk or service load. Time-period fields such as today, yesterday, and recent windows matter because old disruption data can overstate current risk.
