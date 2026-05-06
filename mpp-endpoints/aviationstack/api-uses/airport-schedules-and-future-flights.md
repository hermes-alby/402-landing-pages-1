# AviationStack: Airport Schedules And Future Flights API Uses

## What This Endpoint Group Does

This group covers airport-centered current-day timetable data and future schedule data. Both endpoints take an airport IATA code and departure/arrival type, then return flight rows with airline, flight, terminal, gate, timing, status, delay, aircraft, and codeshare details.

## Endpoints Covered

| Method | Path | Purpose | Key inputs | Key outputs |
| --- | --- | --- | --- | --- |
| GET | /v1/timetable | Current-day airport departures or arrivals | iataCode, type, status, terminals, delays, time filters, airline/flight identifiers, lang | airline, flight, terminal/gate/baggage, scheduled/estimated/actual times, delay, status, codeshares |
| GET | /v1/flightsFuture | Future scheduled airport departures or arrivals | iataCode, type, date, airline_iata, airline_icao, flight_number | weekday, departure/arrival airport and time, terminal/gate, aircraft model, airline, flight, codeshares |

## Field Notes

### Inputs

The strongest inputs are iataCode and type. /v1/flightsFuture also requires date. /v1/timetable adds filters for status, terminal, delay, scheduled/estimated/actual times, airline fields, flight fields, and language.

### Outputs

The current-day timetable includes status and operational timing fields such as scheduledTime, estimatedTime, actualTime, estimatedRunway, actualRunway, delay, terminal, gate, and baggage. Future schedules focus on planned time, weekday, aircraft model, airline/flight identity, and codeshare fields.

### Important Constraints Or Gaps

Both endpoints are documented as Basic-plan-or-higher upstream. The docs mention rate limits for /timetable and /flightsFuture, but the exact numeric limits were not fully normalized. Current-day timetable data is operational and can change; future schedules are plans, not guarantees.

## Use Cases

### Airport Arrival And Departure Boards

A person can check an airport's departures or arrivals for the day by iataCode and type, then filter by flight_iata, airline_iata, terminal, or status. That answers concrete questions: whether a flight is active, which gate or terminal to use, whether baggage information exists, and whether the scheduled time has shifted.

A hotel, lounge, airport shuttle, or corporate travel desk can use the same fields to maintain an operational board for watched airports. Delay, terminal, gate, and estimated/actual timestamps can drive customer notifications and staff dispatch decisions.

### Staffing And Capacity Planning Around Flight Banks

Airport-adjacent businesses can use /v1/timetable to identify arrival and departure waves by terminal, status, and scheduled/estimated times. The fields support practical actions: schedule front-desk coverage, shuttle rotations, cleaning teams, baggage support, or meet-and-greet staff when real arrivals cluster.

For a personal user, the same data is useful when planning when to arrive at an airport during a busy wave. The business value is higher because staffing decisions are repeated and delay-sensitive.

### Future Itinerary And Transfer Planning

/v1/flightsFuture gives planned flights by airport, date, and departure/arrival type. A traveler can validate that a future flight appears on the airport schedule, check terminal/gate when available, and understand whether a codeshare carrier is involved.

Travel agencies, tour operators, and event organizers can pre-build transfer manifests from future schedule data, then reconcile against /v1/timetable or /v1/flights as travel day approaches. The caveat is that future schedules are planned data and need refreshes closer to departure.

### Codeshare Normalization For Customer Communications

Both schedule endpoints expose codeshare details. A traveler may know the marketing flight number, while airport displays may show the operating carrier. Matching codeshared.airline and codeshared.flight fields reduces confusion.

A business can use this to route notifications under the flight number the customer recognizes while still tracking the operating airline and actual airport row. This is useful for airline support, travel management, and group travel logistics.
