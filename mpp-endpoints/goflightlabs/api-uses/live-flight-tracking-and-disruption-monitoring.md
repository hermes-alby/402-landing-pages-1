# GoFlightLabs: Live Flight Tracking And Disruption Monitoring API Uses

## What This Endpoint Group Does

This group answers operational questions about flights that are happening now or have near-term disruption: where an aircraft is, which airline/flight/callsign it belongs to, whether it is on the ground or en route, and whether a flight is delayed. It combines broad real-time search, callsign lookup, airline fleet-in-air lookup, flight-number status rows, and delay-threshold search.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /flights | Real-time flights | limit, flightIata, flightIcao, flightNum, airlineIata, airlineIcao | hex, reg_number, flag, lat, lng, alt, dir, speed |
| GET | /flights-callsign | Flights by callsign | callsign, airline_icao | id, icao_24bit, latitude, longitude, heading, altitude, ground_speed, squawk |
| GET | /flights-airline | Flights by airline | airline_icao | id, icao_24bit, latitude, longitude, heading, altitude, ground_speed, squawk |
| GET | /flight-info-by-flight-number | Flight info by number | flight_number, date | DATE, FROM, TO, AIRCRAFT, FLIGHT TIME, STD, ATD, STA |
| GET | /flight-delay | Flight delay info | delay, type, arr_iata, arr_icao, dep_iata, dep_icao | airline_iata, airline_icao, flight_iata, flight_icao, flight_number, dep_iata, dep_icao, dep_terminal |

## Field Notes

### Inputs

Important inputs are flight identifiers (`flightIata`, `flightIcao`, `flightNum`, `flight_number`), callsigns, airline IATA/ICAO codes, departure/arrival IATA/ICAO airport codes, aircraft registration or ICAO24 hex, and a delay threshold with `type=departures` or `type=arrivals`. Real-time search also accepts a `limit` up to 10000 in the provider docs.

### Outputs

The richest live fields are coordinates, altitude, heading, speed, vertical speed, signal update timestamps, aircraft registration/hex, flight numbers, airline codes, departure/arrival airport codes, and statuses. Delay outputs add scheduled, estimated, and actual departure/arrival times, delay minutes, terminals, gates, baggage claim, and codeshare fields.

### Important Constraints Or Gaps

The provider's real-time docs say data is updated every 10 minutes. Flight Delay has two documented response shapes: a summarized departure/arrival delay object and a delayed-flight array. Direct provider calls require `access_key`; MPP wrapper parameter/auth details are not documented beyond the wrapper path and payment hints.

## Use Cases

### Proactive Traveler Disruption Alerts

A traveler or travel assistant can poll a known flight number, callsign, or route filter before leaving for the airport. The useful fields are status, delay minutes, scheduled/estimated/actual times, terminal/gate, baggage, and last update timestamps. The output supports decisions such as leaving later, contacting the airline, rebooking before a connection becomes impossible, or notifying pickup contacts.

A business travel platform can run the same workflow across employee itineraries and open a service ticket when `delayed`, `dep_actual`, or `arr_estimated` crosses policy thresholds. The main limitation is freshness: a 10-minute live update cadence is useful for alerting but not a replacement for airline operational systems.

### Airport Pickup And Ground Transport Dispatch

A person picking up a passenger can use flight-number or live route fields to decide when to leave, where to wait, and whether the arrival terminal or baggage claim changed. Latitude/longitude and status fields help distinguish a flight still en route from one that has landed but not reached baggage.

A car-service or hotel shuttle operator can automate dispatch timing by combining arrival estimates, actual timestamps, terminal/gate/baggage fields, and route identifiers. This can reduce waiting time and missed pickups, but the workflow should keep a human override because gates and baggage fields may be null.

### Airline Or Airport Operations Watchlist

An airport operations team can watch all flights for an airline or airport pair using airline and dep/arr filters. Aircraft position, on-ground state, delay thresholds, and scheduled/actual timestamps allow staff to prioritize stand planning, gate checks, customer-service staffing, and disruption communication.

A travel insurer, logistics provider, or corporate travel desk can turn the same fields into automated exceptions: if a flight's delay exceeds 60 minutes, open a claim review, notify a shipment receiver, or flag a traveler itinerary for rebooking. The endpoint does not expose passenger, booking, or ticket data, so it must be joined with internal itinerary records.

### Aircraft And Callsign Tracking For Aviation Enthusiasts Or Fleet Teams

A user can follow a specific callsign, registration, or ICAO24 hex and receive current position, heading, speed, altitude, and status. For personal use this supports aviation tracking and arrival estimates. For business use it can enrich fleet-monitoring dashboards or exception reports when a partner aircraft is off expected route or delayed.

This use depends on public signal coverage and the endpoint's update cadence. Some fields may be blank for small aircraft or incomplete ADS-B records, so downstream automations should tolerate missing origin/destination/airline values.
