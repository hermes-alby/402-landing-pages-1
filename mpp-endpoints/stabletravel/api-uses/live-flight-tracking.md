# StableTravel: Live Flight Tracking API Uses

## What This Endpoint Group Does

Use FlightAware real-time search, canonical identifiers, positions, tracks, route information, maps, and notification intents to monitor active flights. StableTravel exposes these operations as paid HTTP calls using x402/MPP, while the upstream live flight data comes from FlightAware AeroAPI surfaces. This artifact describes practical uses only; it does not endorse calling booking, cancel, or payment-requiring operations without explicit approval.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/api/flightaware/flights/:id/map` | Get a flight track map payload (proxied from FlightAware) | height, width, layer_on, layer_off, show_data_block, airports_expand_view, show_airports | response schema shallow/undocumented |
| GET | `/api/flightaware/flights/:id` | Get flight information by ident (designator, registration, or fa_flight_id) | ident_type, start, end, max_pages, cursor | flights, links, num_pages |
| GET | `/api/flightaware/flights/search` | Search for flights by query string (-latlong, -idents, -airline syntax) | query | flights, links, num_pages |
| GET | `/api/flightaware/flights/search/positions` | Search for flights with position data | query, unique_flights, filter | flights, links, num_pages |
| GET | `/api/flightaware/flights/search/count` | Count the number of flights matching a search query | query | count |
| GET | `/api/flightaware/flights/search/advanced` | Advanced flight search with extended query syntax | query | flights, links, num_pages |
| GET | `/api/flightaware/flights/:id/canonical` | Get the canonical flight identifier for a given ident | ident_type, country_code | ident, ident_icao, ident_iata, fa_flight_id |
| POST | `/api/flightaware/flights/:id/intents` | Set a flight intent for push notifications | ident, intent | response schema shallow/undocumented |
| GET | `/api/flightaware/flights/:id/position` | Get the latest position for a flight by fa_flight_id | none documented | fa_flight_id, altitude, altitude_change, groundspeed, heading, latitude, longitude, timestamp |
| GET | `/api/flightaware/flights/:id/track` | Get the flight track (position history) for a flight | include_estimated_positions | positions |
| GET | `/api/flightaware/flights/:id/route-info` | Get the filed route for a flight | none documented | route_distance, fixes |

## Field Notes

### Inputs

- height
- width
- layer_on
- layer_off
- show_data_block
- airports_expand_view
- show_airports
- ident_type
- start
- end
- max_pages
- cursor
- query (required)
- unique_flights
- filter
- country_code
- ident (required)
- intent (required)
- include_estimated_positions

### Outputs

- flights
- links
- num_pages
- count
- ident
- ident_icao
- ident_iata
- fa_flight_id
- altitude
- altitude_change
- groundspeed
- heading
- latitude
- longitude
- timestamp
- update_type
- positions
- route_distance
- fixes

### Important Constraints Or Gaps

- All successful operations are paid x402/MPP calls; this research did not call them.
- Successful response payloads are sometimes shallow in OpenAPI; exact upstream nested fields may vary by Amadeus, FlightAware, or Google Flights response.
- No rate limits, freshness SLA, booking fulfillment terms, webhook behavior, or refund/void policy was found in the public StableTravel docs.
- Booking, cancellation, notification-intent, or order-changing workflows are operationally sensitive and need explicit user authorization, idempotency controls, and spend limits.

## Use Cases

### Real-Time Traveler Monitoring

FlightAware search, canonical ID, position, track, route-info, and map endpoints let a traveler or assistant monitor a flight from ident to live position. Outputs such as fa_flight_id, position, route, track history, delays, and map payloads help decide when to leave for the airport, notify a pickup, or escalate rebooking.

### Airline And Dispatch Operations Watchlist

An operations team can search flights by ident, airline, or lat/long box, count matches, and pull positions for active monitoring. The workflow is useful for irregular operations, charter coordination, and executive travel, but repeated live polling is paid and needs budgets and freshness expectations.

### Route Deviation And ETA Analysis

Track and route-info fields can compare the actual path with filed routing. Personal use includes understanding why a flight is late; business use includes airport transfer adjustment, crew planning, and customer-notification automation when the live track diverges from expected arrival timing.

### Notification Intent Setup

The intent endpoint suggests support for push-notification intent setup around a flight, but public docs do not fully describe callback delivery, lifecycle, or authentication. It is valuable as a possible alert primitive, but it needs more validation before production reliance.
