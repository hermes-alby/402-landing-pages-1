# StableTravel API Uses

## Service Summary

StableTravel is a Merit Systems pay-per-request travel API service for flights, hotels, activities, airport transfers, reference data, Google Flights-style price comparison, and FlightAware real-time/historical aviation data. The public docs position it as no-auth and no-subscription: access is mediated by x402/MPP micropayments rather than StableTravel API keys or account plans.

This research used public GET documentation only. It did not call paid endpoints, make bookings, cancel orders, create accounts, sign wallet messages, or perform mutations.

## API Surface

| Group | Endpoints | What it enables | Full details |
| --- | ---: | --- | --- |
| [Flight Shopping And Booking](api-uses/flight-shopping-and-booking.md) | 12 | Use Amadeus-backed GDS flight search, price confirmation, booking, order management, seat maps, upsells, availability, schedule status, and check-in links for executable flight-booking workflows. | [Details](api-uses/flight-shopping-and-booking.md) |
| [Google Flights Price Comparison](api-uses/google-flights-price-comparison.md) | 2 | Use Google Flights/SerpAPI-style shopping data to compare market prices and booking links before deciding whether to book elsewhere. | [Details](api-uses/google-flights-price-comparison.md) |
| [Hotel Search Ratings And Booking](api-uses/hotel-search-ratings-and-booking.md) | 8 | Find hotels by city/geocode/name, search offers, inspect offer details, book a hotel offer, and pull sentiment ratings/reviews. | [Details](api-uses/hotel-search-ratings-and-booking.md) |
| [Activities Discovery](api-uses/activities-discovery.md) | 3 | Search tours and activities by point or bounding square and retrieve detailed activity records for trip planning. | [Details](api-uses/activities-discovery.md) |
| [Airport Transfers Booking](api-uses/airport-transfers-booking.md) | 3 | Search, book, and cancel airport transfer offers using pickup/drop-off locations, passenger counts, and transfer timing. | [Details](api-uses/airport-transfers-booking.md) |
| [Travel Reference Data](api-uses/travel-reference-data.md) | 7 | Resolve airports, cities, airlines, routes, nearby airports, and recommended destinations used as inputs to other travel workflows. | [Details](api-uses/travel-reference-data.md) |
| [Live Flight Tracking](api-uses/live-flight-tracking.md) | 11 | Use FlightAware real-time search, canonical identifiers, positions, tracks, route information, maps, and notification intents to monitor active flights. | [Details](api-uses/live-flight-tracking.md) |
| [Airport Operations And Weather](api-uses/airport-operations-and-weather.md) | 17 | Inspect airport metadata, nearby airports, delays, arrivals/departures, scheduled flights, route filings, flight counts, METAR observations, and TAF forecasts. | [Details](api-uses/airport-operations-and-weather.md) |
| [Historical Flight And Operator Analysis](api-uses/historical-flight-and-operator-analysis.md) | 9 | Analyze historical flights, tracks, maps, routes, airport flows, aircraft last flights, and operator flight histories. | [Details](api-uses/historical-flight-and-operator-analysis.md) |
| [Disruption Risk Signals](api-uses/disruption-risk-signals.md) | 2 | Retrieve current disruption counts by airline, origin, or destination and by time window for route or carrier risk screening. | [Details](api-uses/disruption-risk-signals.md) |

## Highest-Value Uses

1. Autonomous trip planning that starts with Google Flights price benchmarking, validates searchable airport/city inputs with reference data, then uses Amadeus flight/hotel/transfer/activities endpoints only when a concrete itinerary is worth pricing or booking.
2. Traveler disruption monitoring that combines FlightAware live flight tracking, airport delays/weather, and disruption counts to decide whether to leave earlier, rebook, change transfers, or notify a support team.
3. Corporate travel policy automation that screens fare, cabin, carrier, route, hotel location, ratings, and operational risk before a human approves any booking mutation.
4. Concierge and agency workflows that assemble full itineraries: flight, hotel, activity, and airport transfer options with one payment-native API surface instead of multiple upstream contracts.
5. Aviation and travel-ops analysis that uses historical tracks, airport flows, aircraft/operator history, and route data for evidence, reliability scoring, and operational review.

## Personal Use Opportunities

- Compare flight prices across Google Flights-style results and Amadeus offers before spending money on a booking.
- Ask an agent to assemble a complete trip: route, fare, lodging, activities, airport transfer, check-in links, and live flight monitoring.
- Monitor a flight, destination airport, and transfer timing during disruption-prone travel days.
- Preserve historical flight evidence for compensation, insurance, missed-connection, or support disputes.
- Use reference data to resolve ambiguous city, airport, and airline inputs before deeper paid searches.

## Business Use Opportunities

- Build low-volume travel agency or concierge automation without direct Amadeus, FlightAware, and Google Flights integration setup.
- Enforce corporate travel policy by checking fare totals, cabin class, carrier, stop count, hotel geography, ratings, and disruption risk before approval.
- Coordinate traveler support, pickups, lounges, and staffing with live arrivals/departures, airport delays, weather, and flight counts.
- Run aviation due diligence using historical tracks, aircraft last-flight records, operator histories, and route/airport flow records.
- Prototype travel products where per-request payment is preferable to provider onboarding, API-key custody, monthly plans, or prepaid credits.

## Endpoint Group Summaries

### Flight Shopping And Booking

Use Amadeus-backed GDS flight search, price confirmation, booking, order management, seat maps, upsells, availability, schedule status, and check-in links for executable flight-booking workflows. It covers 12 endpoints and is detailed in [api-uses/flight-shopping-and-booking.md](api-uses/flight-shopping-and-booking.md).

### Google Flights Price Comparison

Use Google Flights/SerpAPI-style shopping data to compare market prices and booking links before deciding whether to book elsewhere. It covers 2 endpoints and is detailed in [api-uses/google-flights-price-comparison.md](api-uses/google-flights-price-comparison.md).

### Hotel Search Ratings And Booking

Find hotels by city/geocode/name, search offers, inspect offer details, book a hotel offer, and pull sentiment ratings/reviews. It covers 8 endpoints and is detailed in [api-uses/hotel-search-ratings-and-booking.md](api-uses/hotel-search-ratings-and-booking.md).

### Activities Discovery

Search tours and activities by point or bounding square and retrieve detailed activity records for trip planning. It covers 3 endpoints and is detailed in [api-uses/activities-discovery.md](api-uses/activities-discovery.md).

### Airport Transfers Booking

Search, book, and cancel airport transfer offers using pickup/drop-off locations, passenger counts, and transfer timing. It covers 3 endpoints and is detailed in [api-uses/airport-transfers-booking.md](api-uses/airport-transfers-booking.md).

### Travel Reference Data

Resolve airports, cities, airlines, routes, nearby airports, and recommended destinations used as inputs to other travel workflows. It covers 7 endpoints and is detailed in [api-uses/travel-reference-data.md](api-uses/travel-reference-data.md).

### Live Flight Tracking

Use FlightAware real-time search, canonical identifiers, positions, tracks, route information, maps, and notification intents to monitor active flights. It covers 11 endpoints and is detailed in [api-uses/live-flight-tracking.md](api-uses/live-flight-tracking.md).

### Airport Operations And Weather

Inspect airport metadata, nearby airports, delays, arrivals/departures, scheduled flights, route filings, flight counts, METAR observations, and TAF forecasts. It covers 17 endpoints and is detailed in [api-uses/airport-operations-and-weather.md](api-uses/airport-operations-and-weather.md).

### Historical Flight And Operator Analysis

Analyze historical flights, tracks, maps, routes, airport flows, aircraft last flights, and operator flight histories. It covers 9 endpoints and is detailed in [api-uses/historical-flight-and-operator-analysis.md](api-uses/historical-flight-and-operator-analysis.md).

### Disruption Risk Signals

Retrieve current disruption counts by airline, origin, or destination and by time window for route or carrier risk screening. It covers 2 endpoints and is detailed in [api-uses/disruption-risk-signals.md](api-uses/disruption-risk-signals.md).

## Field And Data Themes

- Identifiers: IATA airport/city/airline codes, FlightAware idents and `fa_flight_id`, Amadeus hotel IDs, hotel offer IDs, activity IDs, transfer and order IDs, Google Flights departure tokens.
- Time fields: departure and return dates, scheduled departure date, check-in/check-out dates, transfer start time, FlightAware start/end windows, METAR/TAF timing, disruption-count time periods.
- Money and quantity fields: fare totals, currency codes, max prices, passenger/traveler counts, hotel adults/rooms, activity max results, flight counts, fixed per-operation payment amounts.
- Location fields: origin/destination airports, city codes, latitude/longitude, geocode, bounding squares, hotel radius, transfer pickup/drop-off address, nearby airports, routes.
- Operational content: flight status, tracks, route fixes, maps, airport delays, weather observations/forecasts, reviews/ratings, booking links, check-in links, warnings.
