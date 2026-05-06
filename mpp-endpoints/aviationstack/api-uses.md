# AviationStack API Uses

## Service Summary

AviationStack provides flight tracking, airport schedules, route lookup, and aviation reference data. The MPP wrapper exposes 11 GET endpoints for real-time/historical flights, current and future schedules, airline routes, and lookup tables for airports, airlines, airplanes, aircraft types, cities, countries, and taxes.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Flight Tracking And History | 1 | Monitor live and recent historical flight status, timing, gates, delays, baggage, codeshares, and live aircraft position. | [flight-tracking-and-history.md](api-uses/flight-tracking-and-history.md) |
| Airport Schedules And Future Flights | 2 | Inspect current airport timetables and planned future departures/arrivals for operational planning. | [airport-schedules-and-future-flights.md](api-uses/airport-schedules-and-future-flights.md) |
| Aviation Reference Data | 7 | Resolve and enrich airport, airline, aircraft, city, country, and aviation tax identifiers. | [aviation-reference-data.md](api-uses/aviation-reference-data.md) |
| Airline Route Lookup | 1 | Discover airline route patterns by origin, destination, airline, and flight number. | [airline-route-lookup.md](api-uses/airline-route-lookup.md) |

## Highest-Value Uses

The strongest use is disruption-aware travel operations: monitor flight_status, delays, scheduled/estimated/actual timestamps, gates, terminals, baggage, and live aircraft position to decide when to dispatch staff, notify travelers, rebook, or open support cases.

The second strongest use is airport schedule planning: use /v1/timetable and /v1/flightsFuture to plan current-day airport activity and future transfers, then reconcile those plans against live flight tracking as travel day approaches.

Reference and route endpoints are most valuable as supporting data. They normalize codes, make user interfaces readable, power autocomplete, and provide join keys for analytics and workflow automation.

## Personal Use Opportunities

- Track an arriving or departing flight and decide when to leave for the airport.
- Monitor delays, cancellations, diversions, and baggage/gate information before contacting the airline or adjusting plans.
- Validate airport, city, airline, and flight identifiers when entering an itinerary.
- Check future airport schedules and codeshares before a trip.

## Business Use Opportunities

- Dispatch chauffeurs, hotel shuttles, concierge staff, or customer-support workflows from live flight and airport schedule fields.
- Triage disrupted travelers by status and delay thresholds.
- Build transfer manifests and refresh them as future schedules become current-day timetables.
- Normalize flight, airport, airline, aircraft, city, country, and tax identifiers across CRMs, booking records, invoices, and analytics tables.
- Use route data for lightweight network discovery, recurring-lane watchlists, and travel-market enrichment.

## Endpoint Group Summaries

### Flight Tracking And History

/v1/flights combines live and recent historical tracking. Its core value is decision timing: status, delays, gates, terminals, baggage, estimated and actual timestamps, and optional live aircraft position are actionable for pickup, disruption, claims, and operations workflows. Full details: [flight-tracking-and-history.md](api-uses/flight-tracking-and-history.md).

### Airport Schedules And Future Flights

/v1/timetable and /v1/flightsFuture are airport-centered schedule endpoints. They support current-day boards, future planning, staffing, transfers, and codeshare reconciliation. Full details: [airport-schedules-and-future-flights.md](api-uses/airport-schedules-and-future-flights.md).

### Aviation Reference Data

The seven lookup endpoints provide the code dictionaries and enrichment context needed to make flight data usable: airport coordinates/timezones, airline metadata, airplane details, aircraft types, city/country metadata, and aviation tax names. Full details: [aviation-reference-data.md](api-uses/aviation-reference-data.md).

### Airline Route Lookup

/v1/routes describes route patterns updated every 24 hours. It is useful for discovery, watchlist construction, and airline/airport market context, but not for real-time operational truth. Full details: [airline-route-lookup.md](api-uses/airline-route-lookup.md).

## Field And Data Themes

Important identifiers include IATA and ICAO airport, airline, aircraft, and flight codes; ICAO24; country ISO codes; GeoNames ids; and provider-specific ids for airlines, airplanes, aircraft types, countries, cities, and taxes. Important time fields include flight_date, scheduled/estimated/actual departure and arrival times, runway times, live.updated, future schedule date, and route daily update cadence. Location fields include airport/city coordinates, timezones, GMT offsets, terminal, gate, and baggage.
