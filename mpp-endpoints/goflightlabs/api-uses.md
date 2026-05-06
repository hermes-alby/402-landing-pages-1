# GoFlightLabs API Uses

## Service Summary

GoFlightLabs provides public aviation and travel data for real-time flight tracking, delay monitoring, schedules, historical records, future flight predictions, flight prices, airports, airlines, countries/currencies, and airline routes. The MPP service exposes 15 paid GET endpoints from the provider's API surface without requiring the user to manage a GoFlightLabs subscription in this research workflow.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| Live Flight Tracking And Disruption Monitoring | 5 | Current aircraft/flight position, status, delay, callsign, airline, and flight-number lookups for operational alerts. | [details](api-uses/live-flight-tracking-and-disruption-monitoring.md) |
| Schedules, History, And Predictions | 4 | Airport schedules, past movement records, future predicted flights, and detailed date-window flight records. | [details](api-uses/schedules-history-and-predictions.md) |
| Flight Shopping And Market Search | 3 | Priced flight options, roundtrip pairings, place search, country market, and currency metadata. | [details](api-uses/flight-shopping-and-market-search.md) |
| Aviation Reference And Route Data | 3 | Airport, airline, and route reference data for enrichment, normalization, and network analysis. | [details](api-uses/aviation-reference-and-route-data.md) |

## Highest-Value Uses

- Monitor flight disruptions and decide whether to rebook, delay a departure to the airport, dispatch pickup transport, or notify stakeholders before an airline alert arrives.
- Build airport or corporate-travel operations workflows that combine schedules, live status, terminals, gates, baggage, estimated/actual times, and delay thresholds.
- Compare flight price options by route/date using price, currency, stops, duration, carrier, and departure/arrival times, while treating results as leads that need booking verification.
- Analyze route reliability and carrier/airport patterns by storing historical and schedule records over time.
- Normalize flight data with airport, airline, country, currency, and route reference fields before displaying or automating decisions.

## Personal Use Opportunities

A traveler can track a known flight, watch delay thresholds, check whether pickup should be delayed, compare schedule reliability before booking, and monitor prices for a route/date. The most useful fields are flight number/callsign, status, live position, scheduled/estimated/actual times, delay minutes, terminal/gate/baggage, price, stop count, duration, and carrier.

## Business Use Opportunities

Travel platforms, corporate travel desks, logistics teams, hotels, airport vendors, insurers, and travel agencies can use these endpoints for itinerary monitoring, disruption triage, shuttle dispatch, staffing forecasts, route reliability analysis, travel policy screening, carrier/airport enrichment, and claims evidence. The endpoints become much more valuable when joined with internal itinerary, passenger, shipment, policy, or booking records.

## Endpoint Group Summaries

### Live Flight Tracking And Disruption Monitoring

Live status, position, callsign, airline, flight-number, and delay endpoints support proactive operational response: alerts, pickup timing, rebooking triage, and exception handling. Full artifact: [api-uses/live-flight-tracking-and-disruption-monitoring.md](api-uses/live-flight-tracking-and-disruption-monitoring.md).

### Schedules, History, And Predictions

Schedule, historical, future, and date-window endpoints support planning and analytics around airport operations, route reliability, missed-connection risk, and audit evidence. Full artifact: [api-uses/schedules-history-and-predictions.md](api-uses/schedules-history-and-predictions.md).

### Flight Shopping And Market Search

Price, place-search, and country/currency endpoints support fare monitoring, corporate travel screening, roundtrip comparison, and localized search. Full artifact: [api-uses/flight-shopping-and-market-search.md](api-uses/flight-shopping-and-market-search.md).

### Aviation Reference And Route Data

Airport, airline, and route endpoints support code normalization, route network planning, operational context, and carrier profile enrichment. Full artifact: [api-uses/aviation-reference-and-route-data.md](api-uses/aviation-reference-and-route-data.md).

## Field And Data Themes

Key identifiers include IATA/ICAO airport and airline codes, flight numbers, callsigns, aircraft registration, ICAO24/hex, SkyId/entityId, and route airport pairs. Time fields are central: scheduled, estimated, revised, runway, actual, local, UTC, UNIX timestamps, and future prediction sort times. Location fields include lat/lng, city, country, timezone, terminals, gates, and baggage. Commercial fields include flight price, currency, duration, stops, carriers, and market/currency metadata.
