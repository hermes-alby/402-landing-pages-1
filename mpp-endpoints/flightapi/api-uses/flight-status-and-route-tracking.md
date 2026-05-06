# FlightAPI: Flight Status And Route Tracking API Uses

## What This Endpoint Group Does

This endpoint group supports operational tracking after a route or flight is known. The flight-by-number endpoint takes an airline code, flight number, date, and optional departure airport disambiguator. The route endpoint takes a date and two airport IATA codes and returns flights operating between those airports.

The useful fields are status, scheduled and estimated times, actual off-ground or on-ground times, terminal, gate, baggage, airport names and codes, carrier/operator names, and route-level flight lists.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | `/airline/:rest*` | Track a specific flight | Airline code, flight number, date, optional departure airport | Departure and arrival objects, scheduled/estimated/actual timing, airport names/codes/countries, terminal, gate, baggage, time remaining |
| GET | `/trackbyroute/:rest*` | List tracked flights between airports | Departure date, origin airport IATA, destination airport IATA | Airline, flight number, status, operating carrier, departure time, arrival time |

## Field Notes

### Inputs

`/airline/:rest*` maps to the provider `/airline/<api_key>?num=<flight_number>&name=<airline_code>&date=<YYYYMMDD>&depap=<airport>` pattern. `depap` is optional unless the same flight identifier exists from multiple departure airports. `/trackbyroute/:rest*` maps to `/trackbyroute/<api_key>?date=<YYYYMMDD>&airport1=<origin>&airport2=<destination>`.

### Outputs

The flight-by-number sample returns an array with separate `departure` and `arrival` objects. These include operational fields such as `offGroundTime`, `outGateTime`, `onGroundTime`, `inGateTime`, `scheduledTime`, `estimatedTime`, `departureDateTime`, `arrivalDateTime`, `terminal`, `gate`, `baggage`, `airport`, `airportCity`, `airportCode`, and `airportCountryCode`.

The route sample returns flight rows with `Airline`, `FlightNumber`, `Status`, `Operated By`, `DepartureTime`, and `ArrivalTime`. The example shows statuses such as `In Air` and `Arrived`.

### Important Constraints Or Gaps

The docs do not state data refresh cadence, historical lookback, future schedule horizon, timezone normalization rules, or whether every airline/airport has equal coverage. The route endpoint example is shallow and may omit additional fields. No MPP-specific docs clarify upstream API-key handling.

## Use Cases

### Disruption-Aware Traveler Assistance

A personal travel agent can monitor a traveler's known flight using airline code, number, and date. `estimatedTime`, `timeRemaining`, `offGroundTime`, `onGroundTime`, terminal, gate, and baggage fields help decide whether to leave for the airport, warn a pickup driver, update a hotel arrival time, or prepare a missed-connection plan.

For a business, the same data can feed traveler support operations. A travel desk can detect likely delays before an employee asks for help and trigger rebooking review when estimated arrival slips past a connection or meeting threshold.

### Airport Pickup And Concierge Coordination

A hotel, chauffeur service, or event team can track inbound flights and use `arrivalDateTime`, `estimatedTime`, `onGroundTime`, `terminal`, `gate`, and `baggage` to time pickup staging. For individuals, this reduces waiting at arrivals and helps decide when to leave home.

The fields are operationally useful because they distinguish scheduled time from actual or estimated events. The gap is that baggage and gate can be null, so a workflow should degrade gracefully and not promise exact curbside timing.

### Route Operations Watchlist

An airport operations team, travel support desk, or route analyst can query flights between two airports for a date and monitor returned `Status`, `DepartureTime`, `ArrivalTime`, `Airline`, and `Operated By` fields. This helps answer "what is moving on this route now?" without knowing every flight number in advance.

For a traveler, the same route query can reveal alternative flights on the same city pair when their booked flight is delayed. A business workflow could combine route results with inventory or booking data from another system, because FlightAPI itself does not expose seat availability or ticket purchase operations.

### Codeshare And Operator Awareness

The route endpoint exposes `Operated By`, and the flight endpoint uses airline and airport fields around a specific flight. That helps a user identify when the marketed carrier differs from the operator, which can affect terminal, check-in desk, baggage rules, and support channels.

For businesses, operator awareness can reduce support errors in itinerary messaging. The limitation is that the documented route response only provides operator text, not a normalized operator code, so downstream matching may need a separate airline-code lookup or manual normalization.

### Exception Alerts For Customer Support

Travel platforms, tour operators, and executive assistants can store an expected schedule, then compare FlightAPI's status and timing fields to trigger alerts when actual or estimated times diverge. A delayed arrival can update meeting logistics; an early arrival can update pickup timing; a missing flight can trigger manual review.

The API is useful for exception handling because it returns status and timing facts rather than only static schedule. However, the docs' 404 and 410 meanings are ambiguous, so error handling should preserve raw errors and avoid assuming every failed lookup means the flight does not exist.
