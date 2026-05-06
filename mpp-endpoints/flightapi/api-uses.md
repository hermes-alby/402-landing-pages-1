# FlightAPI API Uses

## Service Summary

FlightAPI provides flight price search, live flight tracking, airport schedule, and airline/airport code lookup APIs. The MPP service wraps seven public GET endpoint families for one-off paid access to FlightAPI-style data: one-way fares, round-trip fares, multi-city fares, flight-by-number tracking, route tracking, code lookup, and airport schedules.

The strongest MPP use cases are low-volume travel planning and operational travel assistance where a user or agent needs a few structured flight-data calls without opening a FlightAPI account, buying a monthly plan, or managing provider API credentials. The main integration caveat is that public MPP-specific docs were not found, so upstream API-key handling through `:rest*` remains unclear.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Flight Price Search | 3 | Compare one-way, round-trip, and multi-city fares using route, passenger, cabin, price, stop, carrier, quote-age, and booking-provider fields. | [flight-price-search.md](api-uses/flight-price-search.md) |
| Flight Status And Route Tracking | 2 | Track a known flight or list flights between airports for disruption alerts, pickup timing, and route operations. | [flight-status-and-route-tracking.md](api-uses/flight-status-and-route-tracking.md) |
| Airline And Airport Reference | 1 | Resolve user-entered airline or airport names to code/name records before calling price, tracking, or schedule endpoints. | [airline-and-airport-reference.md](api-uses/airline-and-airport-reference.md) |
| Airport Schedule Monitoring | 1 | Retrieve airport arrivals/departures, schedule pages, flight rows, status, carrier, airport, and timing fields. | [airport-schedule-monitoring.md](api-uses/airport-schedule-monitoring.md) |

## Highest-Value Uses

The highest-value personal use is an AI travel assistant that can validate airports and airlines, compare fares, monitor selected flights, and coordinate airport arrival or pickup timing. The documented fields support this end to end: code lookup cleans inputs, price endpoints compare itinerary cost and burden, tracking endpoints watch known flights, and schedules help identify flights when itinerary details are incomplete.

The highest-value business use is travel operations support for agencies, corporate travel desks, hotels, chauffeur services, event teams, and travel marketplaces. These teams can use price and schedule data to qualify trips, enforce policy, detect disruptions, adjust staffing, and route exceptions to humans.

## Personal Use Opportunities

- Compare route options by price, stops, duration, carrier, cabin, and quote freshness before opening a booking provider.
- Monitor a booked flight for estimated arrival, terminal, gate, baggage, and time-remaining fields.
- Discover candidate flights from an airport schedule when a traveler has incomplete itinerary details.
- Resolve fuzzy names like "American" or "Heathrow" into codes before making paid search or tracking calls.
- Coordinate pickups by watching arrivals schedules or specific flight tracking fields.

## Business Use Opportunities

- Corporate travel desks can screen fares against budget, cabin, stop, and carrier policies before approval.
- Travel agencies can use multi-city fare and stopover fields to design realistic complex itineraries.
- Hotels, car services, and event operators can staff pickup windows using arrivals, estimated times, baggage, and terminal fields.
- Travel support teams can route disruption exceptions when status or estimated times diverge from expected schedules.
- Travel marketplaces can qualify leads with live route prices and booking-provider handoff links.

## Endpoint Group Summaries

### Flight Price Search

The price-search group covers `GET /onewaytrip/:rest*`, `GET /roundtrip/:rest*`, and `GET /multitrip/:rest*`. It enables fare comparison, itinerary feasibility checks, corporate policy screening, fare monitoring, and travel lead qualification. See [flight-price-search.md](api-uses/flight-price-search.md).

### Flight Status And Route Tracking

The tracking group covers `GET /airline/:rest*` and `GET /trackbyroute/:rest*`. It enables known-flight monitoring, airport pickup coordination, route watchlists, codeshare/operator awareness, and customer support exception alerts. See [flight-status-and-route-tracking.md](api-uses/flight-status-and-route-tracking.md).

### Airline And Airport Reference

The reference group covers `GET /iata/:rest*`. It enables natural-language travel intake cleanup, code normalization, autocomplete, and validation before more expensive paid calls. See [airline-and-airport-reference.md](api-uses/airline-and-airport-reference.md).

### Airport Schedule Monitoring

The schedule group covers `GET /schedule/:rest*`. It enables airport pickup and staffing windows, disruption monitoring, flight discovery before specific tracking, codeshare/operator messaging, and airport context enrichment. See [airport-schedule-monitoring.md](api-uses/airport-schedule-monitoring.md).

## Field And Data Themes

FlightAPI's most useful fields are identifiers, route geography, time, price, and operational status. Price endpoints use airport codes, passenger counts, cabin class, currency, itinerary IDs, leg IDs, segment IDs, carrier codes, booking providers, price amounts, quote timestamps, stop counts, and handoff URLs. Tracking and schedule endpoints use airline codes, flight numbers, airport codes, scheduled/estimated/actual timing, status text, terminal, gate, baggage, operator, aircraft, and timezone/location fields.

The API examples use reference-style structures: itinerary records point to legs and segments, while schedule and multi-trip responses nest airport, carrier, and timing details. Any normalization should preserve these source structures because the docs warn that additional arrays and attributes can appear.
