# StableTravel: Historical Flight And Operator Analysis API Uses

## What This Endpoint Group Does

Analyze historical flights, tracks, maps, routes, airport flows, aircraft last flights, and operator flight histories. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream historical flight, airport, aircraft, and operator data comes from FlightAware AeroAPI surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/flightaware/history/flights/:id` | Get historical flight information by ident | ident_type, start, end, max_pages, cursor | flights, links, num_pages |
| GET | `/api/flightaware/history/airports/:id/flights/departures` | Get historical airport departures | airline, max_pages, cursor, start, end | departures, links, num_pages |
| GET | `/api/flightaware/history/aircraft/:registration/last-flight` | Get the last flight for an aircraft by registration | none documented | fa_flight_id, ident, ident_icao, ident_iata, operator, operator_icao, operator_iata, flight_number |
| GET | `/api/flightaware/history/flights/:id/track` | Get the historical flight track (position history) | include_estimated_positions | positions |
| GET | `/api/flightaware/history/flights/:id/map` | Get a historical flight map payload (proxied from FlightAware) | height, width, layer_on, layer_off, show_data_block, airports_expand_view, show_airports | response schema shallow/undocumented |
| GET | `/api/flightaware/history/flights/:id/route-info` | Get the filed route for a historical flight | none documented | route_distance, fixes |
| GET | `/api/flightaware/history/airports/:id/flights/arrivals` | Get historical airport arrivals | airline, max_pages, cursor, start, end | arrivals, links, num_pages |
| GET | `/api/flightaware/history/airports/:id/flights/to/:dest_id` | Get historical flights from one airport to another | start, end, max_pages, cursor | flights, links, num_pages |
| GET | `/api/flightaware/history/operators/:id/flights` | Get historical flights for an operator | start, end, max_pages, cursor | flights, links, num_pages |

## Field Notes

### Inputs

- ident_type
- start
- end
- max_pages
- cursor
- airline
- include_estimated_positions
- height
- width
- layer_on
- layer_off
- show_data_block
- airports_expand_view
- show_airports

### Outputs

- flights
- links
- num_pages
- departures
- fa_flight_id
- ident
- ident_icao
- ident_iata
- operator
- operator_icao
- operator_iata
- flight_number
- registration
- atc_ident
- origin
- destination
- departure_delay
- arrival_delay
- filed_ete
- actual_out
- actual_off
- actual_on
- actual_in
- scheduled_out
- scheduled_off
- scheduled_on
- scheduled_in
- status
- progress_percent
- aircraft_type
- route_distance
- filed_airspeed
- filed_altitude
- route
- baggage_claim
- gate_origin
- gate_destination
- terminal_origin
- terminal_destination
- type

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Delay Claims And Travel Evidence

Historical flight, track, map, and route-info endpoints can preserve evidence around what actually happened on a past trip. A traveler can support insurance or compensation claims; a business travel team can document disruption patterns, but should preserve source snapshots and paid response receipts for auditability.

### Airport And Route Reliability Analysis

Historical arrivals, departures, and airport-pair flights let analysts compare how reliable a route or airport has been. This is useful for corporate travel policy, event arrival planning, and logistics commitments where past performance affects future booking choices.

### Aircraft And Operator Due Diligence

Aircraft last-flight and operator-history endpoints can help aviation businesses, charter customers, or insurers inspect recent aircraft/operator activity. These endpoints are among the more expensive StableTravel operations, so the workflow should be targeted and auditable rather than broad polling.

### Post-Trip Operations Review

Historical track and map payloads let teams reconstruct where delays occurred and whether a missed connection, pickup failure, or service-level breach was foreseeable. The data is retrospective, so it supports analysis and dispute resolution more than live intervention.
